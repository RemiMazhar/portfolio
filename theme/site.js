// Small extras. The site still works if this file does not load.

// Preview cards: play the video while the pointer is over the card.
const canHover = matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches;
if (canHover) {
  document.querySelectorAll(".card").forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;
    const start = () => video.play().catch(() => {});
    const stop = () => {
      video.pause();
      video.load(); // goes back to the still picture
    };
    card.addEventListener("pointerenter", start);
    card.addEventListener("pointerleave", stop);
  });
}

// Only one video with sound at a time.
document.addEventListener("play", (event) => {
  document.querySelectorAll("video").forEach((video) => {
    if (video !== event.target && !video.muted) video.pause();
  });
}, true);

// Click a picture to see it full size. Arrow keys move through the page's pictures.
const zoomLinks = [...document.querySelectorAll("a.zoom")];
if (zoomLinks.length) {
  const box = document.createElement("dialog");
  box.className = "lightbox";
  box.setAttribute("aria-label", "Enlarged picture");
  box.innerHTML = `
    <div class="lightbox-stage"><img alt=""></div>
    <div class="lightbox-bar">
      <span class="lightbox-caption"></span>
      <button type="button" data-move="-1" aria-label="Previous picture">←</button>
      <button type="button" data-move="1" aria-label="Next picture">→</button>
      <button type="button" data-close>Close</button>
    </div>`;
  document.body.append(box);

  const image = box.querySelector("img");
  const caption = box.querySelector(".lightbox-caption");
  let current = 0;

  const show = (index) => {
    current = (index + zoomLinks.length) % zoomLinks.length;
    const link = zoomLinks[current];
    image.src = link.href;
    image.alt = link.querySelector("img")?.alt || "";
    caption.textContent = link.dataset.caption || "";
  };

  if (zoomLinks.length === 1) {
    box.querySelectorAll("[data-move]").forEach((button) => (button.hidden = true));
  }

  zoomLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      show(index);
      box.showModal();
    });
  });

  box.addEventListener("click", (event) => {
    const move = event.target.closest("[data-move]");
    if (move) show(current + Number(move.dataset.move));
    else if (event.target.closest("[data-close]") || event.target.classList.contains("lightbox-stage")) box.close();
  });

  box.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  box.addEventListener("close", () => {
    if (!box.open) image.removeAttribute("src");
  });
}
