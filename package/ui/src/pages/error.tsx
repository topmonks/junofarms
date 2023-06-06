import { useRouteError } from "react-router-dom";

export default function Error() {
  const error: any = useRouteError();

  return (
    <div id="error-page">
      <span>Sorry, an unexpected error has occurred.</span>
      <pre>
        <span>{error.statusText || error.message}</span>
      </pre>
    </div>
  );
}
