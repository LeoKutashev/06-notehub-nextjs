import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  text?: string;
}

export default function ErrorMessage({ text = "There was an error, please try again..." }: ErrorMessageProps) {
  return (
    <>
      <p className={css.error_text}>
        <hr />
        {text}
      </p>
    </>
  );
}