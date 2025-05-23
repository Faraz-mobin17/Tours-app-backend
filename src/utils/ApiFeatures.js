/*
 * req.query is replaced by this.queryString
 * Tour.find() query is replaced by this.query.find()
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString }; // req.query
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this; // return entire obj
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log("SortBy: " + sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this; // return entire obj
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this; // return the entire obj
  }
  paginate() {
    const _page = this.queryString.page * 1 || 1;
    const _limit = this.queryString.limit * 1 || 100;
    const _skip = (_page - 1) * _limit;
    this.query = this.query.skip(_skip).limit(_limit);

    return this; // return the entire obj
  }
}
export { ApiFeatures };
