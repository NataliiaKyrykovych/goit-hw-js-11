import PixabayApiService from './js/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
export const loadMoreBtn = document.querySelector('.load-more');
const galleryContainer = document.querySelector('.gallery');

formEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
window.addEventListener('DOMContentLoaded', () =>
  loadMoreBtn.classList.add('is-hidden')
);
const pixabayApiService = new PixabayApiService();

const lightboxGallery = new SimpleLightbox('.gallery a', {
  showCounter: false,
  captions: true,
  captionsData: 'alt',
  captionClass: 'captions-style',
}).refresh();

async function onFormSubmit(evt) {
  evt.preventDefault();
  clearGalleryContainer();
  pixabayApiService.resetPage();

  const searchQuery = evt.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notify.warning('Please, enter something.');
    loadMoreBtn.classList.add('is-hidden');
    return;
  }

  pixabayApiService.searchQuery = searchQuery;

  try {
    const data = await pixabayApiService.fetchImage();

    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.classList.add('is-hidden');
      formEl.reset();
      return;
    } else if (pixabayApiService.searchQuery === '') {
      Notify.warning('Please, enter something.');
      loadMoreBtn.classList.add('is-hidden');
      return;
    } 

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    createGalleryMarkup(data.hits);
    lightboxGallery.refresh();
    formEl.reset();

    if (galleryContainer.childElementCount >= data.totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      return;
    }

    loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.log(error.message);
    loadMoreBtn.classList.add('is-hidden');
  }
}

async function onLoadMore() {
  loadMoreBtn.classList.add('is-hidden');
  try {
    const data = await pixabayApiService.fetchImage();
    createGalleryMarkup(data.hits);
    loadMoreBtn.classList.remove('is-hidden');
    lightboxGallery.refresh();

    if (galleryContainer.childElementCount >= data.totalHits) {
      Notify.warning("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error.message);
  }
}

function createGalleryMarkup(hits) {
  const markup = hits
    .map(
      hit => `<a href="${hit.largeImageURL}">
        <div class="photo-card">
          <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${hit.likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${hit.views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${hit.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${hit.downloads}
            </p>
          </div>
        </div>
      </a>`
    )
    .join('');
  galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearGalleryContainer() {
  galleryContainer.innerHTML = '';
}