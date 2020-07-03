import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './users/entities/user.entity';
import { Movie } from './movies/entities/movie.entity';
import { response } from 'express';

@Injectable()
export class AppMailerService {
  public constructor(private readonly mailerService: MailerService) {}

  public purchaseMail(user: User, movies: Movie | Movie[]) {
    let total: number = 0;
    let body =
      '<h2 style="text-align: center;">Blockbuster API</h2> \n' +
      '<h4 style="text-align: center;">Purchase information</h4>' +
      `<h5 style="text-align: center;">Hi ${user.username}! enjoy your movies!</h5>` +
      '<div style="text-align: center;">' +
      '<h3><span style="color: #808080;">Articles</span></h3>' +
      '<table style="width: 50%; margin: 0 auto;" border="0" cellspacing="0"><tr><th style="width:60%; text-align: left;" >Movies</th><th style="width:40%;">Price</th></tr>';
    if (Array.isArray(movies)) {
      movies.forEach((movie) => {
        body += `<tr><td style="text-align: left;">${movie.title}</td><td style="text-align: center;">$${movie.price}</td></tr>`;
        total += Number(movie.price);
      });
    } else {
      body += `<tr><td style="text-align: left;>${movies.title}</td><td style="text-align: center;">$${movies.price}</td></tr>`;
      total += Number(movies.price);
    }
    body += '</table>';
    body += `<h4><span style="color: #808080;">Total:</span> $${total}<br></h4></div>`;

    this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'BlockbusterAPI: Thanks for your purchase!', // Subject line
      text: 'welcome', // plaintext body
      html: body, // HTML body content
    });

    return 'mail sent';
  }

  public rentMail(user: User, movies: Movie | Movie[]) {
    let total: number = 0;
    let body =
      '<h2 style="text-align: center;">Blockbuster API</h2>' +
      '<h4 style="text-align: center;">Rental information</h4>' +
      `<h5 style="text-align: center;">Hi ${user.username}! enjoy your movies!</h5>` +
      '<div style="text-align: center;">' +
      '<h3><span style="color: #808080;">Articles</span></h3>' +
      '<table style="margin: 0 auto;" border="0" cellspacing="0"><tr><th style="text-align: left;" >Rented Movies</th></tr>';
    if (Array.isArray(movies)) {
      movies.forEach((movie) => {
        body += `<tr><td style="text-align: left;">${movie.title}</td></tr>`;
      });
    } else {
      body += `<tr><td style="text-align: left;>${movies.title}</td></tr>`;
    }
    body += '</table></div>';

    this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'BlockbusterAPI: Thanks for your rent!', // Subject line
      text: 'welcome', // plaintext body
      html: body, // HTML body content
    });

    return 'mail sent';
  }

  public resetPasswordMail(keyword: string, email: string) {
    let body =
      '<h2 style="text-align: center;">Blockbuster API</h2>' +
      `<h4 style="text-align: center;">Hi ${email}, use this link to reset your password!</h4><br>`;

    body += '<p>localhost:3000/reset/' + keyword + '</p>';

    this.mailerService.sendMail({
      to: email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'BlockbusterAPI: Password reset!', // Subject line
      text: 'Password reset', // plaintext body
      html: body, // HTML body content
    });

    return 'mail sent';
  }
}
