# nethttp.rb
require 'uri'
require 'net/http'
require_relative './result'

# The amount of time, in milliseconds, that is left for function execution (outside of the HTTP timeout)
BUFFER_TIME = 500.freeze

def handler(event:, context:)
  http_timeout = context.get_remaining_time_in_millis - BUFFER_TIME
  uri_to_check =  URI(event['targetUrl'])

  result = web_request(uri_to_check, http_timeout)
  puts result.to_s
  { success: result.success?, result: result.to_s }
end

def web_request(uri, timeout = 10_000)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = uri.scheme == 'https'
  http.open_timeout = timeout / 1000.0
  http.read_timeout = timeout / 1000.0

  res = http.get(uri.request_uri)
  Result.new(res.code.to_i)
rescue Net::OpenTimeout, Net::ReadTimeout, Net::HTTPBadResponse, Net::HTTPHeaderSyntaxError, Net::ProtocolError, OpenSSL::SSL::SSLError => e
  Result.new(:connection_problem, e.message)
rescue StandardError => e
  Result.new(:error, "#{e.class}: #{e.message}\n#{e.backtrace&.join("\n")}")
end
