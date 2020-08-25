<template>
  <div>
    <Alert v-if="!connected" :alertType="alert.type" :alertMessage="alert.message" />
    <div v-else>
      <NavFeed />
      <Alert
        v-if="alert.active && !alert.activeComment"
        :alertType="alert.type"
        :alertMessage="alert.message"
      />
      <Post
        v-if="posts"
        :idUser="posts[indexLastPost].userID"
        v-on:d-comment-input="dCommentInput(posts[indexLastPost].postID)"
        v-on:reaction-down="sendReaction(posts[indexLastPost].postID, -1)"
        v-on:reaction-up="sendReaction(posts[indexLastPost].postID, 1)"
        v-on:reaction-none="sendReaction(posts[indexLastPost].postID, 0)"
        :reaction="posts[indexLastPost].yourReaction"
      >
        <template v-slot:postDelete v-if="posts[indexLastPost].yourPost > 0">
          <i class="fas fa-times" aria-hidden="true" title="Supprimer le post" v-on:click="deletePost(posts[indexLastPost].postID)"></i>
          <span class="sr-only" role="button">Supprimer le post</span>
        </template>
        <template v-slot:postGif>
          <img :src="posts[indexLastPost].gifUrl" class="card-img" alt="Gif du post" />
        </template>
        <template v-slot:userAvatar>
          <img :src="posts[indexLastPost].avatarUrl" class="card-img avatar rounded-circle mr-1" alt="Avatar de l'utilisateur" />
        </template>
        <template
          v-slot:userName
        >{{ posts[indexLastPost].firstName + ' ' + posts[indexLastPost].lastName }}</template>
        <template
          v-slot:userPseudo
          v-if="posts[indexLastPost].pseudo !== null"
        >{{ '@' + posts[indexLastPost].pseudo }}</template>
        <template v-slot:postLegend>{{ posts[indexLastPost].legend }}</template>
        <template v-slot:createComment>
          <CreateComment
            v-on:comment-sent="updateBody"
            v-if="commentInputShow && commentID === posts[indexLastPost].postID"
          >
            <button
              class="btn btn-light form-control text-center"
              type="submit"
              v-on:click.prevent="postComment(posts[indexLastPost].postID)"
            >Publier</button>
          </CreateComment>
          <Alert
            v-if="alert.active && commentID === posts[indexLastPost].postID"
            :alertType="alert.type"
            :alertMessage="alert.message"
          />
        </template>
        <template v-slot:postDate>{{ posts[indexLastPost].dateCreation }}</template>
        <template v-slot:postUp>{{ posts[indexLastPost].countUp }}</template>
        <template v-slot:postDown>{{ posts[indexLastPost].countDown }}</template>
      </Post>

      <Comment
        v-for="comment in comments"
        :key="comment.postID"
        :idUser="comment.userID"
        v-on:reaction-down="sendReaction(comment.postID, -1)"
        v-on:reaction-up="sendReaction(comment.postID, 1)"
        v-on:reaction-none="sendReaction(comment.postID, 0)"
        :reaction="comment.yourReaction"
      >
        <template v-slot:commentDelete v-if="comment.yourPost > 0">
          <i class="fas fa-times" aria-hidden="true" title="Supprimer le commentaire" v-on:click="deletePost(comment.postID)"></i>
          <span class="sr-only" role="button">Supprimer le commentaire</span>
        </template>
        <template v-slot:userAvatar>
          <img :src="comment.avatarUrl" class="card-img avatar rounded-circle mr-1" alt="Avatar de l'utilisateur" />
        </template>
        <template v-slot:userName>{{ comment.firstName + ' ' + comment.lastName }}</template>
        <template v-slot:userPseudo v-if="comment.pseudo !== null">{{ '@' + comment.pseudo }}</template>
        <template v-slot:commentBody>{{ comment.body }}</template>
        <template v-slot:commentDate>{{ comment.dateCreation }}</template>
        <template v-slot:commentUp>{{ comment.countUp }}</template>
        <template v-slot:commentDown>{{ comment.countDown }}</template>
      </Comment>
    </div>
  </div>
</template>

<script>
import NavFeed from "@/components/NavFeed.vue";
import Post from "@/components/Post.vue";
import Alert from "@/components/Alert.vue";
import CreateComment from "@/components/CreateComment.vue";
import Comment from "@/components/Comment.vue";

export default {
  name: "FeedID",
  components: {
    NavFeed,
    Post,
    Alert,
    CreateComment,
    Comment,
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
      posts: [false],
      body: "",
      commentInputShow: false,
      commentID: "",
    };
  },
  computed: {
    indexLastPost() {
      return this.posts.length - 1;
    },
    comments() {
      return this.posts.filter((e) => e.postID != this.$route.params.id);
    }
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
        .get(`post/${this.$route.params.id}`)
        .then((data) => {
          this.posts = data.data;
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.alertConstant("alert-danger mt-5", "Veuillez vous connecter");
          }
          if (e.response.status === 400) {
            this.alertConstant("alert-danger mt-5", "Aucun post à afficher");
          }
        });
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
        .post(`post/${postID}/reaction`, { reaction: reaction })
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
            this.get();
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
    document.title = "Post | Groupomania";
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
