-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "accepts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maxAge" INTEGER,
ADD COLUMN     "minAge" INTEGER,
ADD COLUMN     "notAccepted" TEXT[] DEFAULT ARRAY[]::TEXT[];

