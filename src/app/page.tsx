import "./globals.css";
import NavBar from "@/components/layout/NavBar";


export default function Home() {
  return (
    <>
      <header>
        <NavBar />
      </header>

      <main>
        <section>
          <h1>JEB Incubator</h1>
          <p className="subtitle">Home Page</p>
        </section>

        <section>
          <h2>Projects</h2>
          <article>
            <h3>Projet 1</h3>
            <p>Description</p>
          </article>
          <article>
            <h3>Projet 2</h3>
            <p>Description</p>
          </article>
        </section>
      </main>

      <footer>
        <p>© 2025 JEB Incubator</p>
      </footer>
    </>
  );
}
