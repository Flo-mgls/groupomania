<template>
  <div>
    <NavFeed />
    <CreatePost v-on:post-sent="post" />
    <Alert v-if="alert.active" :alertType="alert.type" :alertMessage="alert.message" />
    <Post v-for="post in posts" :key="post.postID">
      <template v-slot:postDelete v-if="post.yourPost > 0">
        <i class="fas fa-times" :id="post.postID" v-on:click="deletePost($event)"></i>
      </template>
      <template v-slot:postGif>
        <img src="../assets/images.gif" class="card-img" alt="..." />
      </template>
      <template v-slot:userAvatar>
        <img src="../assets/avatar.jpg" class="card-img avatar rounded-circle mr-1" alt="..." />
      </template>
      <template v-slot:userName>{{ post.firstName + ' ' + post.lastName }}</template>
      <template v-slot:userPseudo v-if="post.pseudo !== null">{{ '@' + post.pseudo }}</template>
      <template v-slot:postLegend>{{ post.legend }}</template>
      <template v-slot:postDate>{{ post.dateCreation }}</template>
      <template v-slot:postUp>{{ post.countUp }}</template>
      <template v-slot:postDown>{{ post.countDown }}</template>
    </Post>
  </div>
</template>

<script>
import NavFeed from "@/components/NavFeed.vue";
import Post from "@/components/Post.vue";
import Alert from "@/components/Alert.vue";
import CreatePost from "@/components/CreatePost.vue";

export default {
  name: "Feed",
  components: {
    NavFeed,
    Post,
    Alert,
    CreatePost
  },
  data: () => {
    return {
      alert: {
        active: false,
        type: "",
        message: ""
      },
      posts: [],
    };
  },
  methods: {
    alertActive(type, message) {
      const dataAlert = this.$data.alert;
      dataAlert.active = true;
      dataAlert.type = type;
      dataAlert.message = message;
      setTimeout(function () {
        dataAlert.active = false;
        dataAlert.type = "";
        dataAlert.message = "";
      }, 4000);
    },
    post(data) {
      const formData = new FormData();
      formData.append('image', data.image);
      formData.append('legend', data.legend);
      this.$axios
      .post("post", formData)
      .then(() => {
        this.alertActive('alert-success', 'Post publié !');
      })
      .catch((e) => console.log(e));
    },
    deletePost(event) {
      this.$axios
        .delete("post/" + event.target.id)
        .then(() => {
          const indexPost = this.$data.posts
            .map((e) => {
              return e.postID;
            })
            .indexOf(parseInt(event.target.id));
          this.$data.posts.splice(indexPost, 1);

          this.alertActive('alert-warning', 'Post supprimé !');
        })
        .catch((e) => console.log(e));
    },
  },
  mounted() {
    this.$axios
      .get("post")
      .then((data) => {
        this.posts = data.data;
      })
      .catch((e) => console.log(e));
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
