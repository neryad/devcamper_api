// @desc get all bootCamps
// @route GET/api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

// @desc get single bootCamps
// @route GET/api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Dusplay bootcamps ${req.params.id}` });
};

// @desc Create a new bootcamp
// @route Post/api/v1/bootcamps/
// @access private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Crate a new bootcamps' });
};

// @desc Update  a  bootcamp
// @route Put/api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg:`Update bootcamps ${req.params.id}`} );
};

// @desc delete a new bootcamp
// @route DELETE/api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg:`delete bootcamps ${req.params.id}`} );
};
