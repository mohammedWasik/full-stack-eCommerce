export class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    //removing fields for cat
    const removeField = ["keyword", "page", "limit"];
    removeField.forEach((key) => delete queryCopy[key]);

    //filter for price and rating
    let queryCopyString = JSON.stringify(queryCopy);
    queryCopyString = queryCopyString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(queryCopyString));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skipProduct = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skipProduct);

    return this;
  }
}
