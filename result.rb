class Result
  def initialize(status, message = nil)
    @status = status
    @message = message
  end

  def success?
    return false if @status == :connection_problem
    return false if @status == :error

    @status >= 200 && @status < 300
  end

  def to_s
    return 'OK' if success?
    return "CONNECTION ERROR: #{@message}" if @status == :connection_problem
    return "SCRIPT ERROR: #{@message}" if @status == :error

    "HTTP/#{@status}"
  end
end
