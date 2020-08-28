<!-- VIEW FEEDID - Page d'un post en particulier contenant la navigation, le post et ses commentaires -->

<template>
  <div>
    <!-- Alert si l'user est non connecté -->
    <Alert v-if="!connected" :alertType="alert.type" :alertMessage="alert.message" />
    <!-- Fin -->
    <div v-else>
      <!-- Navigation -->
      <NavFeed />
      <!-- Fin -->
      <!-- Alert pour la création et suppression des posts -->
      <Alert
        v-if="alert.active && !alert.activeComment"
        :alertType="alert.type"
        :alertMessage="alert.message"
      />
      <!-- Fin -->
      <!-- Post -->
      <Post
        v-if="posts"
        :idUser="posts[indexLastPost].userID"
        v-on:d-comment-input="dCommentInput(posts[indexLastPost].postID)"
        v-on:reaction-down="sendReaction(posts[indexLastPost].postID, -1)"
        v-on:reaction-up="sendReaction(posts[indexLastPost].postID, 1)"
        v-on:reaction-none="sendReaction(posts[indexLastPost].postID, 0)"
        :reaction="posts[indexLastPost].yourReaction"
      >
        <!-- Bouton délétion post -->
        <template v-slot:postDelete v-if="posts[indexLastPost].yourPost > 0">
          <i
            class="fas fa-times"
            aria-hidden="true"
            title="Supprimer le post"
            role="button"
            v-on:click="deletePost(posts[indexLastPost].postID)"
          ></i>
          <span class="sr-only">Supprimer le post</span>
        </template>
        <!-- Fin -->
        <!-- Gif -->
        <template v-slot:postGif>
          <img :src="posts[indexLastPost].gifUrl" class="card-img gif-img" alt="Gif du post" />
        </template>
        <!-- Fin -->
        <!-- User -->
        <template v-slot:userAvatar>
          <img
            :src="posts[indexLastPost].avatarUrl"
            class="card-img avatar rounded-circle mr-1"
            alt="Avatar de l'utilisateur"
          />
        </template>
        <template
          v-slot:userName
        >{{ posts[indexLastPost].firstName + ' ' + posts[indexLastPost].lastName }}</template>
        <template
          v-slot:userPseudo
          v-if="posts[indexLastPost].pseudo !== null"
        >{{ '@' + posts[indexLastPost].pseudo }}</template>
        <!-- Fin -->
        <!-- Corps du post -->
        <template v-slot:postLegend>{{ posts[indexLastPost].legend }}</template>
        <!-- Fin -->
        <!-- Création d'un commentaire -->
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
            v-if="alert.active && alert.activeComment && (commentID === posts[indexLastPost].postID)"
            :alertType="alert.type"
            :alertMessage="alert.message"
          />
        </template>
        <!-- Fin -->
        <!-- Footer post -->
        <template v-slot:postDate>{{ posts[indexLastPost].dateCreation }}</template>
        <template v-slot:postUp>{{ posts[indexLastPost].countUp }}</template>
        <template v-slot:postDown>{{ posts[indexLastPost].countDown }}</template>
      </Post>
      <!-- Fin -->

      <!-- Commentaire -->
      <Comment
        v-for="comment in comments"
        :key="comment.postID"
        :idUser="comment.userID"
        v-on:reaction-down="sendReaction(comment.postID, -1)"
        v-on:reaction-up="sendReaction(comment.postID, 1)"
        v-on:reaction-none="sendReaction(comment.postID, 0)"
        :reaction="comment.yourReaction"
      >
        <!-- Bouton délétion commentaire -->
        <template v-slot:commentDelete v-if="comment.yourPost > 0">
          <i
            class="fas fa-times"
            aria-hidden="true"
            title="Supprimer le commentaire"
            role="button"
            v-on:click="deletePost(comment.postID)"
          ></i>
          <span class="sr-only">Supprimer le commentaire</span>
        </template>
        <!-- Fin -->
        <!-- User -->
        <template v-slot:userAvatar>
          <img
            :src="comment.avatarUrl"
            class="card-img avatar rounded-circle mr-1"
            alt="Avatar de l'utilisateur"
          />
        </template>
        <template v-slot:userName>{{ comment.firstName + ' ' + comment.lastName }}</template>
        <template v-slot:userPseudo v-if="comment.pseudo !== null">{{ '@' + comment.pseudo }}</template>
        <!-- Fin -->
        <!-- Corps du commentaire -->
        <template v-slot:commentBody>{{ comment.body }}</template>
        <!-- Fin -->
        <!-- Footer commentaire -->
        <template v-slot:commentDate>{{ comment.dateCreation }}</template>
        <template v-slot:commentUp>{{ comment.countUp }}</template>
        <template v-slot:commentDown>{{ comment.countDown }}</template>
        <!-- Fin -->
      </Comment>
      <!-- Fin -->
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
      connected: true, // Défini si l'user est connecté
      alert: {
        active: false, // Défini si l'alerte doit être montré
        activeComment: false, // Défini si l'alerte concerne un commentaire
        type: "",
        message: "",
      },
      posts: [false], // Stock le post et ses commentaires
      body: "", // Stock le corps du commentaire
      commentInputShow: false, // Défini si l'input de la création de commentaire doit être montré
      commentID: "", // Stock l'id du post pour lequel le commentaire sera envoyé
    };
  },
  computed: {
    indexLastPost() {
      // Permet de ne prendre que le post étant le dernier élément du tableau
      return this.posts.length - 1;
    },
    comments() {
      // Permet d'exclure le post pour ne garder que les commentaires
      return this.posts.filter((e) => e.postID != this.$route.params.id);
    },
  },
  methods: {
    alertConstant(type, message) {
      // Crée une alerte
      const dataAlert = this.$data.alert;
      this.connected = false;
      dataAlert.type = type;
      dataAlert.message = message;
    },
    alertActive(type, message) {
      // Crée une alerte pendant 4 secondes
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
      // Récupère le post et ses commentaires
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
      // Supprime un post ou un commentaire si c'est le notre
      this.$axios
        .delete("post/" + postID)
        .then(() => {
          if (postID === this.$route.params.id) {
            this.$router.push({ name: "Feed"});
          }
          const indexPost = this.$data.posts
            .map((e) => {
              return e.postID;
            })
            .indexOf(parseInt(postID));
          this.$data.posts.splice(indexPost, 1);

          this.alertActive("alert-warning", "Commentaire supprimé !");
        })
        .catch((e) => console.log(e));
    },
    sendReaction(postID, reaction) {
      // Envois les réactions
      this.$axios
        .post(`post/${postID}/reaction`, { reaction: reaction })
        .then(() => {
          this.get();
        })
        .catch((e) => console.log(e));
    },
    dCommentInput(postID) {
      // Dévoile l'input pour créer un commentaire
      if (this.commentInputShow) {
        this.commentID = postID;
      } else {
        this.commentInputShow = true;
        this.commentID = postID;
      }
    },
    updateBody(data) {
      // Stock le corps du commentaire
      this.body = data.body;
    },
    postComment(postID) {
      // Poste un commentaire
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
    // Récupère le post et ses commentaires et défini le titre
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
  top: 1em;
  z-index: 1;
  &:hover {
    color: rgb(233, 68, 38);
  }
}
</style>
