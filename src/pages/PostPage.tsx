import { useParams } from "react-router-dom"
import PostDetails from "../components/PostDetails"

function PostPage() {
const {id} = useParams<{id : string}>()

  return (
    <div className="pt-10">
      <PostDetails postId={Number(id)} />
    </div>
  );
}

export default PostPage