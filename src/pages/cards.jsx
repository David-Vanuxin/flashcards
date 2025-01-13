import { useParams } from "react-router";

export function Cards() {
	const params = useParams()
	return (<p>Loading cards with id {params.id}...</p>)
}