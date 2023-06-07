import axios from 'axios';

export default class PixabayApiService {
    constructor() {
    this.key = '37015627-a7b00f6a8ef807ae57085c4f8';
    this.baseURL = 'https://pixabay.com/api/';
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
}

async fetchImage() {
    const { data } = await axios.get(
        `${URL}?key=${this.key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
    );
    this.page += 1;
    return data;
}

resetPage() {
    this.page = 1;
}

get query() {
    return this.searchQuery;
}

set query(newQuery) {
    this.searchQuery = newQuery;
}

}