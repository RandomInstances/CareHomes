-- CreateEnum
CREATE TYPE "HomeTier" AS ENUM ('UNVERIFIED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('IN_PROGRESS', 'PLACED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceKind" AS ENUM ('HOME_VERIFICATION', 'HOME_RENEWAL', 'FAMILY_DEPOSIT', 'FAMILY_BALANCE');

-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('PROPOSED', 'CONFIRMED', 'ATTENDED', 'NO_SHOW', 'CANCELLED');
ALTER TABLE "Appointment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Appointment" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "AppointmentStatus_old";
ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'PROPOSED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_homeId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_appointmentId_fkey";

-- DropIndex
DROP INDEX "Home_status_ownerUpdatedAt_idx";

-- DropIndex
DROP INDEX "Invoice_appointmentId_key";

-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "listingExpiresAt" TIMESTAMP(3),
ADD COLUMN     "tier" "HomeTier" NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Enquiry" ALTER COLUMN "familyName" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "detailsReleasedAt";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "appointmentId",
ADD COLUMN     "enquiryId" TEXT,
ADD COLUMN     "kind" "InvoiceKind" NOT NULL,
ADD COLUMN     "periodEnd" TIMESTAMP(3),
ADD COLUMN     "periodStart" TIMESTAMP(3),
ALTER COLUMN "homeId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Placement" (
    "id" TEXT NOT NULL,
    "enquiryId" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "status" "PlacementStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "movedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Placement_enquiryId_key" ON "Placement"("enquiryId");

-- CreateIndex
CREATE INDEX "Placement_status_movedInAt_idx" ON "Placement"("status", "movedInAt");

-- CreateIndex
CREATE INDEX "Home_status_tier_ownerUpdatedAt_idx" ON "Home"("status", "tier", "ownerUpdatedAt");

-- CreateIndex
CREATE INDEX "Invoice_kind_status_idx" ON "Invoice"("kind", "status");

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
