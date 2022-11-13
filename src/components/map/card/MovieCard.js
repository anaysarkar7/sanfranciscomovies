import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function MovieCard(props) {
  return (
    <Card style={{ width: "18rem" }}>
      {props.movie.title && (
        <Card.Header>MOVIE: {props.movie.title}</Card.Header>
      )}
      <ListGroup variant="flush">
        {props.movie.release_year && (
          <ListGroup.Item>year:{props.movie.release_year}</ListGroup.Item>
        )}
        {props.movie.locations && (
          <ListGroup.Item>location:{props.movie.locations}</ListGroup.Item>
        )}
        {props.movie.fun_facts && (
          <ListGroup.Item>fun facts:{props.movie.fun_facts}</ListGroup.Item>
        )}
        {props.movie.production_company && (
          <ListGroup.Item>
            production company:{props.movie.production_company}
          </ListGroup.Item>
        )}
        {props.movie.distributor && (
          <ListGroup.Item>distributor:{props.movie.distributor}</ListGroup.Item>
        )}
        {props.movie.director && (
          <ListGroup.Item>director:{props.movie.director}</ListGroup.Item>
        )}
        {props.movie.writer && (
          <ListGroup.Item>writer:{props.movie.writer}</ListGroup.Item>
        )}
        {props.movie.actor_1 && (
          <ListGroup.Item>actor 1:{props.movie.actor_1}</ListGroup.Item>
        )}
        {props.movie.actor_2 && (
          <ListGroup.Item>actor 2:{props.movie.actor_2}</ListGroup.Item>
        )}
        {props.movie.actor_3 && (
          <ListGroup.Item>actor 3:{props.movie.actor_3}</ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
}

export default MovieCard;
