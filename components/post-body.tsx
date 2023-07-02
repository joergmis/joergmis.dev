import markdownStyles from "./post-body.module.css";

type Props = {
  content: string;
};

const PostBody = ({ content }: Props) => {
  return (
    <div
      className={"max-w-xl " + markdownStyles["markdown"]}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default PostBody;
