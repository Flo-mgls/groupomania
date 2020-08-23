<template>
  <div>
    <Alert v-if="!connected" :alertType="alert.type" :alertMessage="alert.message" />
    <div v-else>
      <NavFeed />
      <CreatePost v-on:post-sent="post" />
      <Alert
        v-if="alert.active && !alert.activeComment"
        :alertType="alert.type"
        :alertMessage="alert.message"
      />
      <Post
        v-for="post in posts"
        :key="post.postID"
        :idPost="post.postID"
        v-on:d-comment-input="dCommentInput(post.postID)"
        v-on:reaction-down="sendReaction(post.postID, -1)"
        v-on:reaction-up="sendReaction(post.postID, 1)"
        v-on:reaction-none="sendReaction(post.postID, 0)"
        :reaction="post.yourReaction"
      >
        <template v-slot:postDelete v-if="post.yourPost > 0">
          <i class="fas fa-times" v-on:click="deletePost(post.postID)"></i>
        </template>
        <template v-slot:postGif>
          <img :src="post.gifUrl" class="card-img" alt="..." />
        </template>
        <template v-slot:userAvatar>
          <img src="../assets/avatar.jpg" class="card-img avatar rounded-circle mr-1" alt="..." />
        </template>
        <template v-slot:userName>{{ post.firstName + ' ' + post.lastName }}</template>
        <template v-slot:userPseudo v-if="post.pseudo !== null">{{ '@' + post.pseudo }}</template>
        <template v-slot:postLegend>{{ post.legend }}</template>
        <template v-slot:createComment>
          <CreateComment
            v-on:comment-sent="updateBody"
            v-if="commentInputShow && commentID === post.postID"
          >
            <button
              class="btn btn-light form-control text-center"
              type="submit"
              v-on:click.prevent="postComment(post.postID)"
            >Publier</button>
          </CreateComment>
          <Alert
            v-if="alert.active && commentID === post.postID"
            :alertType="alert.type"
            :alertMessage="alert.message"
          />
        </template>
        <template v-slot:postDate>{{ post.dateCreation }}</template>
        <template v-slot:postUp>{{ post.countUp }}</template>
        <template v-slot:postDown>{{ post.countDown }}</template>
      </Post>
    </div>
  </div>
</template>

<script>
import NavFeed from "@/components/NavFeed.vue";
import Post from "@/components/Post.vue";
import Alert from "@/components/Alert.vue";
import CreatePost from "@/components/CreatePost.vue";
import CreateComment from "@/components/CreateComment.vue";

export default {
  name: "Feed",
  components: {
    NavFeed,
    Post,
    Alert,
    CreatePost,
    CreateComment,
  },
  data: () => {
    return {
      connected: true,
      alert: {
        active: false,
        activeComment: false,
        type: "",
        message: "",
      },
      posts: [],
      body: "",
      commentInputShow: false,
      commentID: "",
    };
  },
  methods: {
    alertConstant(type, message) {
      const dataAlert = this.$data.alert;
      this.connected = false;
      dataAlert.type = type;
      dataAlert.message = message;
    },
    alertActive(type, message) {
      const dataAlert = this.$data.alert;
      dataAlert.active = true;
      dataAlert.type = type;
      dataAlert.message = message;
      setTimeout(function () {
        dataAlert.active = false;
        dataAlert.activeComment = false;
        dataAlert.type = "";
        dataAlert.message = "";
      }, 4000);
    },
    get() {
      this.$axios
        .get("post")
        .then((data) => {
          this.posts = data.data;
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.alertConstant("alert-danger mt-5", "Veuillez vous connecter");
          }
        });
    },
    post(data) {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("legend", data.legend);
      this.$axios
        .post("post", formData)
        .then(() => {
          this.get();
          this.alertActive("alert-success", "Post publié !");
        })
        .catch((e) => console.log(e));
    },
    deletePost(postID) {
      this.$axios
        .delete("post/" + postID)
        .then(() => {
          const indexPost = this.$data.posts
            .map((e) => {
              return e.postID;
            })
            .indexOf(parseInt(postID));
          this.$data.posts.splice(indexPost, 1);

          this.alertActive("alert-warning", "Post supprimé !");
        })
        .catch((e) => console.log(e));
    },
    sendReaction(postID, reaction) {
      this.$axios
        .post(`post/${postID}/reaction`, {reaction: reaction})
        .then(() => {
          this.get();
        })
        .catch((e) => console.log(e));
    },
    dCommentInput(postID) {
      if (this.commentInputShow) {
        this.commentID = postID;
      } else {
        this.commentInputShow = true;
        this.commentID = postID;
      }
    },
    updateBody(data) {
      this.body = data.body;
    },
    postComment(postID) {
      const formValid = document
        .getElementsByName("formComment")[0]
        .checkValidity();
      if (formValid) {
        this.$axios
          .post(`post/${postID}/comment`, { body: this.body })
          .then(() => {
            this.commentInputShow = false;
            this.alert.activeComment = true;
            this.alertActive("alert-success mt-1", "Commentaire publié !");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },
  mounted() {
    this.get();
  },
};
</script>


<style scoped lang="scss">
.avatar {
  width: 2em;
  height: 2em;
  object-fit: cover;
}
i {
  position: absolute;
  left: 1em;
  top: 0;
  z-index: 1;
  &:hover {
    color: rgb(233, 68, 38);
  }
}
</style>
