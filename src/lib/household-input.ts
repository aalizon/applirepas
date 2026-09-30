import type { MemberInput } from "@/app/actions";
import type { PresenceStatus } from "./planner";
import { getHousehold } from "./data";

/** Foyer au format de l'éditeur « Qui mange quand ? ». */
export async function getHouseholdInput(): Promise<MemberInput[]> {
  const h = await getHousehold();
  return h.members.map((m) => ({
    id: m.id,
    name: m.name,
    multiplier: m.multiplier,
    isMainUser: m.isMainUser,
    isActive: m.isActive,
    dislikes: m.dislikes,
    allergies: m.allergies ?? "",
    diet: m.diet ?? "",
    likes: m.likes ?? "",
    presence: Object.fromEntries(
      h.rules.filter((r) => r.memberId === m.id).map((r) => [`${r.weekday}-${r.mealType}`, r.status as PresenceStatus]),
    ),
  }));
}
