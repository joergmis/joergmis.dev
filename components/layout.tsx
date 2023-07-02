import Link from "next/link";
import { Inter } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className={'min-h-screen max-w-6xl mx-auto ' + inter.className}>
      <div className="px-8 pb-8 md:px-32 md:pb-16">
        <nav className="my-16">
          <Link href={"/"} className="">Mischa Jörg</Link>
        </nav>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
