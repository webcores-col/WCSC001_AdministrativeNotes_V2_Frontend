import type { components } from './schema';

/**
 * Reexporta los DTOs del contrato real bajo nombres cortos. Único punto de
 * contacto con `schema.d.ts` (generado, no editar a mano) — si el contrato
 * cambia de nombre un schema, solo este archivo se actualiza.
 */
type Schemas = components['schemas'];

export type AuthUserDto = Schemas['AuthUserDto'];
export type AuthTokensDto = Schemas['AuthTokensDto'];

export type UserResponseDto = Schemas['UserResponseDto'];
export type CreateUserDto = Schemas['CreateUserDto'];

export type AssociateResponseDto = Schemas['AssociateResponseDto'];
export type CreateAssociateDto = Schemas['CreateAssociateDto'];
export type UpdateAssociateDto = Schemas['UpdateAssociateDto'];

export type NoteResponseDto = Schemas['NoteResponseDto'];
export type CreateNoteDto = Schemas['CreateNoteDto'];
export type NoteAssociateSummaryDto = Schemas['NoteAssociateSummaryDto'];
export type NoteTypeSummaryDto = Schemas['NoteTypeSummaryDto'];

export type CatalogEntryResponseDto = Schemas['CatalogEntryResponseDto'];
export type CreateCatalogEntryDto = Schemas['CreateCatalogEntryDto'];

export type PageMetaDto = Schemas['PageMetaDto'];
