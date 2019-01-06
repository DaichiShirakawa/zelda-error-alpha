import {ZeldaErrorDBIntegration} from '../types/zelda-error-property-types';
import {ZeldaIssue, ZeldaIssueStatus, ZeldaIssueType} from '../types/zelda-error-types';

let idSequence = 1;

function createMockIssue(situation: string, type: ZeldaIssueType, status: ZeldaIssueStatus): ZeldaIssue {
  return {
    id: `mock_${situation}_${idSequence++}`,
    situation,
    title: `Issue of ${situation} ${idSequence - 1}`,
    vote: 1,
    type,
    status,

    ticket: {
      id: idSequence - 1,
      url: `https://www.google.com/search?q=${idSequence - 1}`,
    },

    props: {
      myProp1: 1,
    },
  };
}

/**
 * Mock implementation for integration to DB.
 */
export const ZeldaErrorDBMock = (): ZeldaErrorDBIntegration => ({
  nextId: async (situation: string): Promise<string> => {
    return `mock_${situation}_${idSequence++}`;
  },

  loadIssues: async (situation: string, showIssues: (issues: ZeldaIssue[]) => void): Promise<void> => {
    showIssues([
      createMockIssue(situation, ZeldaIssueType.error, ZeldaIssueStatus.open),
      createMockIssue(situation, ZeldaIssueType.request, ZeldaIssueStatus.open),
      createMockIssue(situation, ZeldaIssueType.error, ZeldaIssueStatus.next_patch),
      createMockIssue(situation, ZeldaIssueType.request, ZeldaIssueStatus.next_patch),
      createMockIssue(situation, ZeldaIssueType.error, ZeldaIssueStatus.fixed),
      createMockIssue(situation, ZeldaIssueType.request, ZeldaIssueStatus.fixed),
      createMockIssue(situation, ZeldaIssueType.error, ZeldaIssueStatus.fixed),
      createMockIssue(situation, ZeldaIssueType.request, ZeldaIssueStatus.fixed),
      createMockIssue(situation, ZeldaIssueType.error, ZeldaIssueStatus.fixed),
      createMockIssue(situation, ZeldaIssueType.request, ZeldaIssueStatus.fixed),
    ]);
  },

  addIssue: async (issue: ZeldaIssue): Promise<string> => {
    console.log(`issue ${issue.id} saved to DB.`);
    return issue.id;
  },

  updateIssue: async (issue: ZeldaIssue, updated: any): Promise<void> => {
    console.log(`issue ${issue.id} of DB is updated`, updated);
  },

});
