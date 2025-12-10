import Navbar from "../Navbar";
import PetDetail from "./PetDetail";
import PetStatus from "./PetStatus";

export default function PetCare() {
    return (
        <>
            <title>Care For Pet</title>
            <Navbar />
            <PetDetail />
            <PetStatus />
        </>
    )
}