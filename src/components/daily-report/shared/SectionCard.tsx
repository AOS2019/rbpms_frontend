interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function SectionCard({
  title,
  children,
  actions,
}: SectionCardProps) {
  return (
    <section className="bg-white rounded-lg shadow-sm border mb-6">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        {actions}
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}
