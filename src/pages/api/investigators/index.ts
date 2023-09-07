import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { investigatorValidationSchema } from 'validationSchema/investigators';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getInvestigators();
    case 'POST':
      return createInvestigator();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInvestigators() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.investigator
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'investigator'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createInvestigator() {
    await investigatorValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.allegation_allegation_investigator_idToinvestigator?.length > 0) {
      const create_allegation_allegation_investigator_idToinvestigator =
        body.allegation_allegation_investigator_idToinvestigator;
      body.allegation_allegation_investigator_idToinvestigator = {
        create: create_allegation_allegation_investigator_idToinvestigator,
      };
    } else {
      delete body.allegation_allegation_investigator_idToinvestigator;
    }
    const data = await prisma.investigator.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
