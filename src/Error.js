// Morelog error // in process
//==============================================================================
var MorelogError = function(name, origin, solution, code) {

    this.m_name = name;
    this.m_origin = origin;
    this.m_solution = solution;
    this.m_errorCode = code;
    // this.m_errorCode = new Morelog.ErrorCode(code);

    // MorelogErrors.push(this);
}

module.exports = MorelogError;
