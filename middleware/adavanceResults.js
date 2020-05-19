const advanceResults = (model, populate) => async (req,  res, next) => {
    let query;
    // Copy eq.quey
    const reqQuery = { ...req.query };
  
    // fileds to exclude
    const removeFields = ["select", "sort", "page", "limit"];
  
    // lopp over removeflied and delete them from reqQwury
    removeFields.forEach((param) => delete reqQuery[param]);
  
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt,$gt)
    queryStr = queryStr.replace(/\b(gtgte|lt|lte|in)\b/g, (match) => `$${match}`);
  
    // fiding resource
    query = model.find(JSON.parse(queryStr));
  
    // selet fileds
    if (req.query.select) {
      const fileds = req.query.select.split(",").join(" ");
      query = query.select(fileds);
    }
  
    // sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
  
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
  
    query = query.skip(startIndex).limit(limit);

    if(populate){
        query = query.populate(populate);
    }
    // Excuting query
    const results = await query;
  
    // pagination result
    const pagination = {};
  
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
  
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.advanceResults = {
        succes: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
};

module.exports = advanceResults;