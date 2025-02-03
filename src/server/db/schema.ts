
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
  boolean
} from "drizzle-orm/pg-core";

// Files table updated to use pgTable and array syntax for indexes
export const files_table = pgTable(
  "files",
  {
    id: serial("id").primaryKey(),
    ownerId: text("owner_id").notNull(),

    name: text("name").notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
    key: text("key").notNull(),
    extension: text("extension").notNull(),
    parent: integer("parent").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (files) => [
    index("files_parent_idx").on(files.parent),
    index("files_owner_idx").on(files.ownerId),
  ]
);

export type DB_FileType = typeof files_table.$inferSelect;

// Folders table updated to use pgTable and array syntax for indexes
export const folders_table = pgTable(
  "folders",
  {
    id: serial("id").primaryKey(),
    ownerId: text("owner_id").notNull(),

    name: text("name").notNull(),
    parent: integer("parent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (folders) => [
    index("folders_parent_idx").on(folders.parent),
    index("folders_owner_idx").on(folders.ownerId),
  ]
);

export type DB_FolderType = typeof folders_table.$inferSelect;


export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
});
