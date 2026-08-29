-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CareType" AS ENUM ('ASSISTED_LIVING', 'NURSING', 'DEMENTIA', 'RESPITE', 'PALLIATIVE', 'REHAB');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('SINHALA', 'TAMIL', 'ENGLISH');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'SI', 'TA');

-- CreateEnum
CREATE TYPE "HomeStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'LIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OwnerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "EditStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BudgetBand" AS ENUM ('UNDER_75K', 'BAND_75_150K', 'BAND_150_250K', 'OVER_250K');

-- CreateEnum
CREATE TYPE "Timeframe" AS ENUM ('IMMEDIATE', 'WITHIN_1_MONTH', 'WITHIN_3_MONTHS', 'EXPLORING');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'TRIAGED', 'ASSESSED', 'PROFILE_SENT', 'HOME_ACCEPTED', 'BOOKED', 'ATTENDED', 'MOVED_IN', 'CLOSED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PROPOSED', 'INVOICED', 'CONFIRMED', 'ATTENDED', 'NO_SHOW', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('ISSUED', 'PAID', 'CREDITED', 'VOID');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('LISTING_VIEW', 'SEARCH', 'FILTER_APPLIED', 'SHORTLIST_ADD', 'COMPARE_VIEW', 'CALL_INTENT', 'WHATSAPP_CLICK', 'ENQUIRY_SUBMITTED', 'TRIAGED', 'ASSESSED', 'PROFILE_SENT', 'HOME_ACCEPTED', 'APPOINTMENT_BOOKED', 'APPOINTMENT_ATTENDED', 'APPOINTMENT_NO_SHOW', 'MOVED_IN');

-- CreateTable
CREATE TABLE "Suburb" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "district" TEXT NOT NULL DEFAULT 'Colombo',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suburb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Home" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "suburbId" TEXT NOT NULL,
    "district" TEXT NOT NULL DEFAULT 'Colombo',
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "feeFrom" INTEGER,
    "feeTo" INTEGER,
    "feeExcludes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bedsTotal" INTEGER,
    "bedsAvailable" INTEGER,
    "roomTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "careTypes" "CareType"[] DEFAULT ARRAY[]::"CareType"[],
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languages" "Language"[] DEFAULT ARRAY[]::"Language"[],
    "nightNurses" INTEGER,
    "doctorArrangement" TEXT,
    "transferHospital" TEXT,
    "visitingHours" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "status" "HomeStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "nseRegistered" BOOLEAN,
    "isBlanketHome" BOOLEAN NOT NULL DEFAULT false,
    "ownerUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Home_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeTranslation" (
    "id" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT,
    "description" TEXT,

    CONSTRAINT "HomeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "visitedOn" TIMESTAMP(3) NOT NULL,
    "officer" TEXT NOT NULL,
    "nseRegistrationSighted" BOOLEAN NOT NULL DEFAULT false,
    "nightRosterSeen" BOOLEAN NOT NULL DEFAULT false,
    "doctorArrangementSighted" BOOLEAN NOT NULL DEFAULT false,
    "photographedByUs" BOOLEAN NOT NULL DEFAULT false,
    "feeScheduleCollected" BOOLEAN NOT NULL DEFAULT false,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "status" "OwnerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeOwner" (
    "homeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeOwner_pkey" PRIMARY KEY ("homeId","ownerId")
);

-- CreateTable
CREATE TABLE "Edit" (
    "id" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "ownerId" TEXT,
    "diff" JSONB NOT NULL,
    "status" "EditStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Edit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "preferredSuburbs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "careType" "CareType",
    "budgetBand" "BudgetBand",
    "timeframe" "Timeframe",
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "enquiryId" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "enquiryId" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PROPOSED',
    "detailsReleasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "amountLkr" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'ISSUED',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidConfirmedAt" TIMESTAMP(3),
    "creditForInvoiceId" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "homeId" TEXT,
    "enquiryId" TEXT,
    "sessionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Suburb_slug_key" ON "Suburb"("slug");

-- CreateIndex
CREATE INDEX "Suburb_district_idx" ON "Suburb"("district");

-- CreateIndex
CREATE UNIQUE INDEX "Home_slug_key" ON "Home"("slug");

-- CreateIndex
CREATE INDEX "Home_status_suburbId_idx" ON "Home"("status", "suburbId");

-- CreateIndex
CREATE INDEX "Home_status_ownerUpdatedAt_idx" ON "Home"("status", "ownerUpdatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "HomeTranslation_homeId_locale_key" ON "HomeTranslation"("homeId", "locale");

-- CreateIndex
CREATE INDEX "Visit_homeId_visitedOn_idx" ON "Visit"("homeId", "visitedOn");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_phone_key" ON "Owner"("phone");

-- CreateIndex
CREATE INDEX "Edit_status_createdAt_idx" ON "Edit"("status", "createdAt");

-- CreateIndex
CREATE INDEX "OtpCode_phone_expiresAt_idx" ON "OtpCode"("phone", "expiresAt");

-- CreateIndex
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_enquiryId_homeId_key" ON "Recommendation"("enquiryId", "homeId");

-- CreateIndex
CREATE INDEX "Appointment_status_scheduledFor_idx" ON "Appointment"("status", "scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_appointmentId_key" ON "Invoice"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_reference_key" ON "Invoice"("reference");

-- CreateIndex
CREATE INDEX "Invoice_status_issuedAt_idx" ON "Invoice"("status", "issuedAt");

-- CreateIndex
CREATE INDEX "Event_type_createdAt_idx" ON "Event"("type", "createdAt");

-- CreateIndex
CREATE INDEX "Event_homeId_type_createdAt_idx" ON "Event"("homeId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_suburbId_fkey" FOREIGN KEY ("suburbId") REFERENCES "Suburb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeTranslation" ADD CONSTRAINT "HomeTranslation_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeOwner" ADD CONSTRAINT "HomeOwner_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeOwner" ADD CONSTRAINT "HomeOwner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edit" ADD CONSTRAINT "Edit_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edit" ADD CONSTRAINT "Edit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
