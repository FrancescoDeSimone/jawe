import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";
import { triggerRegistry } from "../../core/triggerRegistry";

const ListTriggersResponse = Type.Array(
  Type.Object({
    name: Type.String(),
    id: Type.String(),
    description: Type.String(),
  })
);

const GetTriggerParams = Type.Object({
  id: Type.String(),
});

const UpdateWorkflowTriggerParams = Type.Object({
  id: Type.String(),
});

const UpdateWorkflowTriggerBody = Type.Object({
  isEnabled: Type.Boolean(),
});

const UpdateWorkflowTriggerResponse = Type.Object({
  id: Type.String(),
});

const GetTriggerResponse = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.String(),
  inputs: Type.Any(),
});

const GenericErrorResponse = Type.Object({
  error: Type.String(),
});

export default async function trigger(app: FastifyInstance) {
  app.get<{
    Reply: Static<typeof ListTriggersResponse>;
  }>(
    "/",
    {
      schema: {
        response: { 200: ListTriggersResponse },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(triggerRegistry);
    }
  );

  app.get<{
    Params: Static<typeof GetTriggerParams>;
    Reply: Static<typeof GetTriggerResponse | typeof GenericErrorResponse>;
  }>(
    "/:id",
    {
      schema: {
        params: GetTriggerParams,
        response: {
          200: GetTriggerResponse,
          404: GenericErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const trigger = triggerRegistry.find((t) => t.id === id);

      if (!trigger) {
        return reply
          .status(404)
          .send({ error: `Trigger with ID '${id}' not found.` });
      }

      return reply.status(200).send(trigger);
    }
  );

  app.post<{
    Params: Static<typeof UpdateWorkflowTriggerParams>;
    Body: Static<typeof UpdateWorkflowTriggerBody>;
    Reply: Static<
      typeof UpdateWorkflowTriggerResponse | typeof GenericErrorResponse
    >;
  }>(
    "/workflow/:id",
    {
      schema: {
        params: UpdateWorkflowTriggerParams,
        response: {
          200: UpdateWorkflowTriggerResponse,
          404: GenericErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { isEnabled } = request.body;

      await app.prisma.trigger.update({
        where: { id },
        data: {
          isEnabled: isEnabled,
        },
      });

      return reply.status(200).send({ id });
    }
  );
}
