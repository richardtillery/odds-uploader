console.log('Loading function');
import { createClient } from 'redis';

export const handler = async (event, context) => {

    console.log('Received event:', JSON.stringify(event, null, 2));
    let key = event.teamA + 'v' + event.teamB + '-' + event.teamA + '-' + event.date;
    let value = event.line;
    console.log('key = [%s] and value(line) = [%s]', key, value);

    var client = createClient(
        {
        url:  `redis://localhost:6379`
        //url:  `redis://current-lines-ferywn.serverless.use1.cache.amazonaws.com:6379`
      }
    );
    client.on('error', error => {
        console.error(`Redis client error: `, error);
    });

    await client.connect();
    
    const [setKeyReply, fetchedValue] = await client
    .multi()
    .hSet(key, {
        team: event.teamA,
        line: value
    })
    .hGetAll(key)
    .exec();
    
    console.log(setKeyReply + '=' + JSON.stringify(fetchedValue, null, 2));

    await client.disconnect();

    return event;  // Echo back the sent event
};