export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {children}
    </main>
  );
} 