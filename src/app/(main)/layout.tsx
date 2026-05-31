import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-[1440px] mx-auto shadow-xl">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
