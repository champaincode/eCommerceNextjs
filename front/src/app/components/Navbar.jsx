import Link from "next/link";
import "@fontsource/roboto/400.css";
import ResponsiveAppBar from "../common/ResponsiveAppBar";

const links = [
  {
    label: "Inicio",
    route: "/",
  },
  {
    label: "Favoritos",
    route: "/views/favorites",
  },
];

export function Navbar() {
  return (
    <header>
      <nav>
        <ul>
          <ResponsiveAppBar links={links} />
        </ul>
      </nav>
    </header>
  );
}
