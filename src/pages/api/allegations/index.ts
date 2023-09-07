import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { allegationValidationSchema } from 'validationSchema/allegations';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAllegations();
    case 'POST':
      return createAllegation();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAllegations() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.allegation
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'allegation'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createAllegation() {
    await allegationValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.investigator_investigator_assigned_allegation_idToallegation?.length > 0) {
      const create_investigator_investigator_assigned_allegation_idToallegation =
        body.investigator_investigator_assigned_allegation_idToallegation;
      body.investigator_investigator_assigned_allegation_idToallegation = {
        create: create_investigator_investigator_assigned_allegation_idToallegation,
      };
    } else {
      delete body.investigator_investigator_assigned_allegation_idToallegation;
    }
    if (body?.perpetrator_perpetrator_allegation_idToallegation?.length > 0) {
      const create_perpetrator_perpetrator_allegation_idToallegation =
        body.perpetrator_perpetrator_allegation_idToallegation;
      body.perpetrator_perpetrator_allegation_idToallegation = {
        create: create_perpetrator_perpetrator_allegation_idToallegation,
      };
    } else {
      delete body.perpetrator_perpetrator_allegation_idToallegation;
    }
    if (body?.victim_victim_allegation_idToallegation?.length > 0) {
      const create_victim_victim_allegation_idToallegation = body.victim_victim_allegation_idToallegation;
      body.victim_victim_allegation_idToallegation = {
        create: create_victim_victim_allegation_idToallegation,
      };
    } else {
      delete body.victim_victim_allegation_idToallegation;
    }
    const data = await prisma.allegation.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
