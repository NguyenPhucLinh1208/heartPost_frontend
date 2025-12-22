import Header from "@/components/layout/Header";

export default function LoggedOutLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
}
