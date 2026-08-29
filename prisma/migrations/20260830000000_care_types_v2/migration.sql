-- Reduce the care categories to Elder Homes, Nursing Homes and Rehab.
--
-- Postgres cannot cast the old values to the new enum, so the existing values
-- are cleared first. That is safe here: the only rows are demo listings, which
-- the start-up seed rewrites on every deploy with the mapped values.

UPDATE "Home" SET "careTypes" = ARRAY[]::"CareType"[];
UPDATE "Enquiry" SET "careType" = NULL;

CREATE TYPE "CareType_new" AS ENUM ('ELDER_HOME', 'NURSING_HOME', 'REHAB');

ALTER TABLE "Home" ALTER COLUMN "careTypes" DROP DEFAULT;
ALTER TABLE "Home" ALTER COLUMN "careTypes" TYPE "CareType_new"[] USING ("careTypes"::text[]::"CareType_new"[]);
ALTER TABLE "Enquiry" ALTER COLUMN "careType" TYPE "CareType_new" USING ("careType"::text::"CareType_new");

ALTER TYPE "CareType" RENAME TO "CareType_old";
ALTER TYPE "CareType_new" RENAME TO "CareType";
DROP TYPE "CareType_old";

ALTER TABLE "Home" ALTER COLUMN "careTypes" SET DEFAULT ARRAY[]::"CareType"[];
