import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-screen">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred. </p>
      <p>
        <b>{error.statusText || error.message}</b>
        <i>{JSON.stringify(error)}</i>
      </p>
    </div>
  );
}
