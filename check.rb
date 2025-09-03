def handler(event:, context:)
  puts event['targetUrl'], context.get_remaining_time_in_millis
end
