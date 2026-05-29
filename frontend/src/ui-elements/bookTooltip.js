import { getBookStars } from "../pages/app/book.js";

export function showBookTooltip(book, x, y) {
    const tooltip = document.querySelector("#book-info-tooltip");

    if (!tooltip || !book) return;

    tooltip.querySelector(".tooltip__book-title").textContent =
        book.title || "Untitled";

    tooltip.querySelector(".tooltip__author-name").textContent =
        book.author || "Unknown author";

    tooltip.querySelector(".tooltip__book-status").textContent =
        book.status || "Unread";

    tooltip.querySelector(".tooltip__book-rating").textContent =
        book.rating ?? "0.0";

    tooltip.querySelector(".tooltip__stars").textContent =
        getBookStars(book.rating);

    tooltip.querySelector(".tooltip__page-count").textContent =
        book.pages ?? "—";

    positionBookTooltip(tooltip, x, y);

    tooltip.hidden = false;
}

export function hideBookTooltip() {
    const tooltip = document.querySelector("#book-info-tooltip");

    if (!tooltip) return;

    tooltip.hidden = true;
}

function positionBookTooltip(tooltip, mouseX, mouseY) {
    const offset = 18;

    tooltip.hidden = false;

    const tooltipRect = tooltip.getBoundingClientRect();

    let left = mouseX + offset;
    let top = mouseY + offset;

    if (left + tooltipRect.width > window.innerWidth) {
        left = mouseX - tooltipRect.width - offset;
    }

    if (top + tooltipRect.height > window.innerHeight) {
        top = mouseY - tooltipRect.height - offset;
    }

    tooltip.style.left = `${Math.max(8, left)}px`;
    tooltip.style.top = `${Math.max(8, top)}px`;
}
