import Navbar from "./Navbar";
import './styles/index.css';

export default function About() {
    return (
        <>
            <title>About Page</title>
            <Navbar />
            <div className="m-3 py-2">
                <h2>About Us</h2>
                <div class="container">
                    <div class="d-flex justifiy-content-between" id="authors">
                        <div class="col">
                            <h3>Clare Dixon</h3>
                            <h5>Email: dixonc@uwplatt.edu</h5>
                            <img
                                src="./myotherimages/Clare_Scotland.jpg"
                                alt="Clare Dixon"
                                class="author-pic"
                            />
                        </div>
                        <div class="col">
                            <h3>Collin Lukes</h3>
                            <h5>Email: lukesc@uwplatt.edu</h5>
                            <img
                                src="./myotherimages/collinl.jpg"
                                alt="Collin Lukes"
                                class="author-pic"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <div class="d-flex justify-content-between m-3">
                    <h3>CS3870: Secure Web Developement, Fall 2025</h3>
                    <h3 class="d-flex justify-content-end">10/26/2025</h3>
                </div>
            </footer>
        </>
    )
}