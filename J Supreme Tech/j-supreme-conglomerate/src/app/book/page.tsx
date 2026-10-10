import {
  getBookingSettings,
  listUpcomingBooked,
  publicBookingOwner,
} from "@/lib/data/booking";
import { computeOpenDays } from "@/lib/booking/slots";
import { MEETING_TYPE_META } from "@/lib/meetings/invite";
import { BookingPublic } from "@/components/booking/booking-public";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book a meeting · J Supreme",
  description: "Pick a time that works for you.",
};

export default async function BookPage() {
  const owner = publicBookingOwner();
  const settings = await getBookingSettings(owner);
  const booked = settings.enabled ? await listUpcomingBooked(owner) : [];
  const days = settings.enabled
    ? computeOpenDays(settings, booked, Date.now())
    : [];

  return (
    <BookingPublic
      enabled={settings.enabled}
      title={settings.title}
      description={settings.description}
      timezone={settings.timezone}
      durationMin={settings.duration_min}
      typeLabel={MEETING_TYPE_META[settings.meeting_type].label}
      days={days}
    />
  );
}
