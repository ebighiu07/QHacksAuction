import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {

  return (
    <div className="h-screen  flex flex-col items-center">
      <UserProfile routing="hash"/>
    </div>
  );
}