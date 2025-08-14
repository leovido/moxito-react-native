import { Redirect } from "expo-router";

export default function Index() {
  // Send the initial load to your tabs group
  return <Redirect href="(tabs)" />;
}
