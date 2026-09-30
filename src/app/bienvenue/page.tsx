import { getSettings } from "@/lib/data";
import { getHouseholdInput } from "@/lib/household-input";
import { Wizard } from "./wizard";

export const dynamic = "force-dynamic";

export default async function Bienvenue() {
  const [settings, household] = await Promise.all([getSettings(), getHouseholdInput()]);
  return <Wizard settings={settings} household={household} />;
}
