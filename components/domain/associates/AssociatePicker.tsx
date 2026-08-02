'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { associateFullName } from '@/lib/api/associate-utils';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
import { cn } from '@/lib/utils';
import { useAssociateQuery, useAssociatesQuery } from '@/lib/query/associates';

/**
 * Combobox de búsqueda para elegir un asociado por nombre/apellido/
 * identificación en vez de un `<select>` con miles de opciones (la base
 * tiene ~3.900 asociados). No usa `cmdk`: el radix-ui ya instalado trae
 * `Popover`, y una lista simple de botones alcanza para este caso.
 */
export function AssociatePicker({
  id,
  value,
  onChange,
  placeholder = 'Buscar por nombre o identificación...',
}: {
  id?: string;
  value: string | undefined;
  onChange: (numberIdentity: string | undefined) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const results = useAssociatesQuery({
    page: 1,
    size: 10,
    search: debouncedSearch,
    sort: 'names:asc',
  });
  const selected = useAssociateQuery(value);

  const triggerLabel = value
    ? selected.data
      ? `${associateFullName(selected.data)} (${value})`
      : value
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown
            className="size-4 shrink-0 opacity-50"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width)"
      >
        <div className="p-2">
          <Input
            autoFocus
            aria-label="Buscar asociado"
            placeholder="Nombre, apellido o identificación..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="max-h-64 overflow-y-auto border-t">
          {results.isLoading && (
            <p className="p-3 text-sm text-muted-foreground">Buscando...</p>
          )}
          {results.isSuccess && results.data.data.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">Sin resultados.</p>
          )}
          {results.data?.data.map((associate) => (
            <button
              key={associate.numberIdentity}
              type="button"
              onClick={() => {
                onChange(associate.numberIdentity);
                setOpen(false);
                setSearch('');
              }}
              className={cn(
                'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                value === associate.numberIdentity && 'bg-accent/50',
              )}
            >
              <span className="truncate">
                {associateFullName(associate)}{' '}
                <span className="text-muted-foreground">
                  ({associate.numberIdentity})
                </span>
              </span>
              {value === associate.numberIdentity && (
                <Check className="size-4 shrink-0" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
