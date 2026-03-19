import { Injectable, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { stringify, Options } from 'csv-stringify';
import { Readable } from 'stream';

@Injectable()
export class CsvStreamService {
  /**
   * Pipes a readable stream into a CSV response
   * @param res The Express Response object
   * @param fileName Name of the file to download
   * @param dataStream The database read stream
   * @param columns Mapping of data keys to CSV headers
   */
  streamToResponse(
    res: Response,
    fileName: string,
    dataStream: Readable,
  ) {
    // Set standard CSV headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.csv"`);

    const csvTransformer = stringify({
      header: true,
      cast: {
        date: (value) => value.toISOString().split('T')[0], // Optional: Format dates globally
      },
    });

    // Handle errors to prevent memory leaks/hanging
    dataStream.on('error', (err) => {
      console.error('Database Stream Error:', err);
      if (!res.headersSent) res.status(500).send('Internal Server Error');
    });

    // Pipe the flow
    dataStream.pipe(csvTransformer).pipe(res);
  }
}