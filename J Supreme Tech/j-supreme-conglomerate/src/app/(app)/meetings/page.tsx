import { isSupabasePersistenceEnabled } from "@/lib/env/storage-mode";
import { requireOwnerClerkId } from "@/lib/session";
import { listMeetings, type Meeting } from "@/lib/data/meetings";
import { listCrmClients } from "@/lib/data/crm";
import { getBookingSettings, type BookingSettings } from "@/lib/data/booking";
import { MeetingsClient } from "@/components/meetings/meetings-client";
import { BookingManager } from "@/components/booking/booking-manager";

export const dynamic = "force-dynamic";

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://jsupremeconglomerate.online"
).replace(/\/$/, "");

export default async function MeetingsPage() {
  const owner = await requireOwnerClerkId();
  const persistLocally = !isSupabasePersistenceEnabled();

  let initialMeetings: Meeting[] = [];
  let clients: { id: string; name: string; email: string | null }[] = [];
  let bookingSettings: BookingSettings | null = null;

  if (!persistLocally) {
    const [meetings, crmClients, settings] = await Promise.all([
      listMeetings(owner),
      listCrmClients(owner),
      getBookingSettings(owner),
    ]);
    initialMeetings = meetings;
    clients = crmClients.map((c) => ({
      id: c.id,
      name: c.business_name,
      email: c.email,
    }));
    bookingSettings = settings;
  }

  return (
    <>
      {bookingSettings && (
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
          <BookingManager publicUrl={`${APP_URL}/book`} initialSettings={bookingSettings} />
        </div>
      )}
      <MeetingsClient
        ownerId={owner}
        persistLocally={persistLocally}
        initialMeetings={initialMeetings}
        clients={clients}
      />
    </>
  );
}
