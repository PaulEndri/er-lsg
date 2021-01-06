import { WeaponsLookup } from 'erbs-sdk';

export const ReverseWeaponsLookup = Object.fromEntries(
	Object.entries(WeaponsLookup).map(([ key, name ]) => [ name, key ])
);

export const ReverseWeaponsLookupKeyed = Object.fromEntries(
	Object.entries(WeaponsLookup).map(([ key, name ]) => [ name, key.replace(/[ -]/g, '') ])
);
