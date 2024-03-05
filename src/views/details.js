import { deleteById, getGameById, getAllComments, createComment } from "../api/data.js";
import { html } from "../lib.js";
import { getUserData } from "../util.js";

const detailsTemplate = (game, isOwner, onDelete, comments, onCommentSubmit) => html`
<section id="game-details">
    <h1>Game Details</h1>
    <div class="info-section">

        <div class="game-header">
            <img class="game-img" src=${game.imageUrl} />
            <h1>${game.title}</h1>
            <span class="levels">MaxLevel: ${game.maxLevel}</span>
            <p class="type">${game.category}</p>
        </div>

        <p class="text">
            ${game.summary}
        </p>

        <!-- Bonus ( for Guests and Users ) -->
        <div class="details-comments">
            <h2>Comments:</h2>
            ${comments.length > 0
        ? html`
            <ul>
                ${comments.map(commentTemplate)}
                <ul>
                    <!-- list all comments for current game (If any) -->
                </ul>`
            : html`
                <!-- Display paragraph: If there are no games in the database -->
                <p class="no-comment">No comments.</p>`}
        </div>

        <!-- Edit/Delete buttons ( Only for creator of this game )  -->
        <div class="buttons">
            ${isOwner
        ? html`
            <a href="/edit/${game._id}" class="button">Edit</a>
            <a @click=${onDelete} href="javascript:void(0)" class="button">Delete</a>`
        : null}
        </div>
    </div>

    <!-- Bonus -->
    <!-- Add Comment ( Only for logged-in users, which is not creators of the current game ) -->
    ${!isOwner
    ? createCommentForm(onCommentSubmit, isOwner, getUserData())
    : null
    }

</section>
`;

const createCommentForm = (onCommentSubmit, isOwner, isUser) => html`
${!isOwner && isUser
    ? html` <article class="create-comment">
    <label>Add new comment:</label>
    <form @submit=${onCommentSubmit} class="form">
        <textarea name="comment" placeholder="Comment......"></textarea>
        <input class="btn submit" type="submit" value="Add Comment">
    </form>
</article>`
    : null
    }`;

const commentTemplate = (comment) => html`
<li class="comment">
    <p>Content: ${comment.comment}</p>
</li>
`;

export async function detailsPage(ctx) {
    const gameId = ctx.params.id;
    const game = await getGameById(gameId);
    const comments = await getAllComments(gameId);

    const userData = getUserData();

    const isOwner = userData && userData.id == game._ownerId;

    async function onCommentSubmit(evt) {
        evt.preventDefault();
        const form = new FormData(evt.target);
        const comment = form.get("comment");
        if (comment == '') {
            return alert("Can not post an empty comment!");
        }

        const body = {
            gameId: ctx.params.id,
            comment
        }
        try {
            createComment(body)
        }
        catch (err) {
            alert(err.message);
        }
        evt.target.reset();
        ctx.page.redirect('/details/' + ctx.params.id)
    }


    async function onDelete() {
        const confirmed = confirm('Are you sure?');
        if (confirmed) {
            await deleteById(gameId);
            ctx.page.redirect('/');
        }
    }
    ctx.render(detailsTemplate(game, isOwner, onDelete, comments, onCommentSubmit));
}